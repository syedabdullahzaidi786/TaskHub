import os
import google.generativeai as genai
from google.generativeai.types import FunctionDeclaration, Tool
from sqlmodel import Session
from typing import List, Dict, Any
from ..mcp.server import get_gemini_tools_declaration, TOOL_MAP
from ..models.chat import Message

# Configure Gemini
GENAI_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_KEY:
    genai.configure(api_key=GENAI_KEY)

def format_history_for_gemini(messages: List[Message]):
    """
    Convert DB messages to Gemini history format.
    """
    history = []
    for msg in messages:
        role = "user" if msg.role == "user" else "model"
        history.append({
            "role": role,
            "parts": [msg.content]
        })
    return history

async def run_agent(
    session: Session, 
    user_id: str, 
    message: str, 
    history_messages: List[Message]
) -> Dict[str, Any]:
    """
    Run the Gemini Agent with tools.
    """
    if not GENAI_KEY:
        return {"response": "Error: GEMINI_API_KEY not configured. Please check your .env file.", "tool_calls": []}

    try:
        # Load Tools
        tools_decl = get_gemini_tools_declaration()
        
        # Instantiate model with tools
        # tools_decl is a list of dicts. Pass it directly as 'tools'.
        model = genai.GenerativeModel(
            model_name='gemini-flash-latest',
            tools=tools_decl
        )

        # Re-hydrate chat session
        chat = model.start_chat(history=format_history_for_gemini(history_messages))

        # Send message
        response = chat.send_message(message)
        
        tool_results = []
        final_text_response = ""

        # Check for tool calls
        # We iterate through parts to find function calls
        for part in response.parts:
            # Check for function call
            fn_call = None
            try:
                # Accessing function_call should be safe
                if part.function_call:
                    fn_call = part.function_call
            except Exception:
                pass

            if fn_call:
                tool_name = fn_call.name
                tool_args = dict(fn_call.args)
                
                # Execute Tool
                if tool_name in TOOL_MAP:
                    print(f"Executing tool: {tool_name} with {tool_args}")
                    
                    # Ensure user_id is passed correctly for security
                    tool_args['user_id'] = user_id
                    
                    result = TOOL_MAP[tool_name](session, **tool_args)
                    tool_results.append({
                        "tool": tool_name,
                        "args": tool_args,
                        "result": result
                    })
                    
                    # Send result back to model
                    function_response_part = genai.protos.Part(
                        function_response=genai.protos.FunctionResponse(
                            name=tool_name,
                            response={"result": result}
                        )
                    )
                    
                    final_response = chat.send_message([function_response_part])
                    # Safely extract text from the final response
                    for final_part in final_response.parts:
                        try:
                            if final_part.text:
                                final_text_response += final_part.text
                        except Exception:
                            pass
                else:
                    final_text_response += f"\n(Error: Tool {tool_name} not found)"
            else:
                # Try to get text
                try:
                    if part.text:
                        final_text_response += part.text
                except ValueError:
                    # This happens if the part is not text (e.g. it WAS a function call but check failed?)
                    # Or it's some other content type.
                    print("Skipping non-text part that is not a recognized function call.")
                    pass
                    
        # Fallback: if we have no text and no tools, usually implies empty response or error.
        if not tool_results and not final_text_response:
            final_text_response = "I received an empty response from the AI."

        return {
            "response": final_text_response,
            "tool_calls": tool_results
        }

    except Exception as e:
        print(f"Error in run_agent: {e}")
        import traceback
        traceback.print_exc()
        return {
            "response": f"I encountered an error connecting to the AI: {str(e)}",
            "tool_calls": []
        }
