"""convert_priority_to_uppercase

Revision ID: a5ae0085b97a
Revises: f865d6cad110
Create Date: 2026-01-04 21:44:58.615000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = 'a5ae0085b97a'
down_revision = 'f865d6cad110'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Rename existing enum type
    op.execute("ALTER TYPE priority RENAME TO priority_old")

    # 2. Create new enum type
    op.execute("CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH')")

    # 3. Alter column to use new type with conversion
    # First drop default to avoid casting error
    op.alter_column('todos', 'priority', server_default=None)

    # using 'upper(priority_old::text)::priority'
    op.execute("""
        ALTER TABLE todos 
        ALTER COLUMN priority TYPE priority 
        USING upper(priority::text)::priority
    """)
    
    # 4. Set default value for the new type (optional but good practice)
    op.alter_column('todos', 'priority', server_default=sa.text("'MEDIUM'::priority"))

    # 5. Drop old enum type
    op.execute("DROP TYPE priority_old")


def downgrade() -> None:
    # Reverse logic
    op.execute("ALTER TYPE priority RENAME TO priority_new")
    op.execute("CREATE TYPE priority AS ENUM ('Low', 'Medium', 'High')")
    op.execute("""
        ALTER TABLE todos 
        ALTER COLUMN priority TYPE priority 
        USING initcap(priority::text)::priority
    """)
    op.alter_column('todos', 'priority', server_default=sa.text("'Medium'::priority"))
    op.execute("DROP TYPE priority_new")
