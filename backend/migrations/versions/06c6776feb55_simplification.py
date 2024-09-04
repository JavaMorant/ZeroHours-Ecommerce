"""Simplification

Revision ID: 06c6776feb55
Revises: 02f823c65420
Create Date: 2024-09-01 22:56:08.508598

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '06c6776feb55'
down_revision = '02f823c65420'
branch_labels = None
depends_on = None


def upgrade():

    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_constraint('fk_orders_user_id_users', type_='foreignkey')
        batch_op.drop_column('user_id')
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('baskets')
    op.drop_table('users')
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('customer_email', sa.String(length=345), nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('user_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.VARCHAR(length=32), nullable=False))
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'])
        batch_op.drop_column('customer_email')

    op.create_table('users',
    sa.Column('id', sa.VARCHAR(length=32), nullable=False),
    sa.Column('email', sa.VARCHAR(length=345), nullable=False),
    sa.Column('password', sa.TEXT(), nullable=False),
    sa.Column('email_verified', sa.BOOLEAN(), nullable=True),
    sa.Column('created_at', sa.DATETIME(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('last_online', sa.DATETIME(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('id')
    )
    op.create_table('baskets',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('user_id', sa.VARCHAR(length=32), nullable=False),
    sa.Column('product_id', sa.VARCHAR(length=32), nullable=False),
    sa.Column('quantity', sa.INTEGER(), nullable=False),
    sa.Column('size', sa.VARCHAR(length=5), nullable=False),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
