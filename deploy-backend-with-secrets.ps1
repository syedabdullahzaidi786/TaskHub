# Helper command to install with secrets
helm upgrade --install todo-backend ./charts/todo-backend -f ./charts/todo-backend/values.yaml -f ./charts/todo-backend/values.secrets.yaml
