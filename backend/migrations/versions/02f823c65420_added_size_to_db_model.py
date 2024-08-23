"""Added size to db model

Revision ID: 02f823c65420
Revises: 5964e7e4c0a5
Create Date: 2024-08-23 17:34:07.864415

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '02f823c65420'
down_revision = '5964e7e4c0a5'
branch_labels = None
depends_on = None

def upgrade():
    # Use batch operations for SQLite compatibility
    with op.batch_alter_table('baskets', schema=None) as batch_op:
        # If the column doesn't exist, add it
        if 'size' not in [c['name'] for c in sa.inspect(op.get_bind()).get_columns('baskets')]:
            batch_op.add_column(sa.Column('size', sa.String(), nullable=True))
        
        # Update existing rows to have a default value
        op.execute("UPDATE baskets SET size = 'default_size' WHERE size IS NULL")
        
        # Now make the column NOT NULL
        batch_op.alter_column('size', nullable=False)

def downgrade():
    with op.batch_alter_table('baskets', schema=None) as batch_op:
        # Make the column nullable again
        batch_op.alter_column('size', nullable=True)
