"""Create users and todos tables

Revision ID: 001
Revises:
Create Date: 2025-12-27

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', UUID(), nullable=False, primary_key=True),
        sa.Column('email', sa.VARCHAR(length=255), nullable=False),
        sa.Column('password_hash', sa.VARCHAR(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('ix_users_email', 'users', ['email'])

    # Create todos table
    op.create_table(
        'todos',
        sa.Column('id', UUID(), nullable=False, primary_key=True),
        sa.Column('user_id', UUID(), nullable=False),
        sa.Column('title', sa.VARCHAR(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default=sa.text('FALSE')),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_todos_user_id', 'todos', ['user_id'])


def downgrade() -> None:
    op.drop_index('ix_todos_user_id', table_name='todos')
    op.drop_table('todos')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
