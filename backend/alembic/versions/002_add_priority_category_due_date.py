"""Add priority category due_date

Revision ID: 002
Revises: 001
Create Date: 2025-12-31

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add priority, category, and due_date columns to todos table
    op.add_column('todos', sa.Column('priority', sa.VARCHAR(length=20), nullable=False, server_default='Medium'))
    op.add_column('todos', sa.Column('category', sa.VARCHAR(length=50), nullable=False, server_default='General'))
    op.add_column('todos', sa.Column('due_date', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('todos', 'due_date')
    op.drop_column('todos', 'category')
    op.drop_column('todos', 'priority')
