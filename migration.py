from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider

auth_provider = PlainTextAuthProvider(username='cassandra', password='cassandra')

cluster = Cluster(['127.0.0.1'], port=9042, auth_provider=auth_provider)
session = cluster.connect('messages')

session.execute(
    """
        CREATE TABLE IF NOT EXISTS conversations (
          conversation_id uuid,
          created_at timestamp,
          participants set<uuid>,
          PRIMARY KEY (conversation_id)
        )
        WITH compression = {'sstable_compression': 'LZ4Compressor'};
    """
)

session.execute(
	"""
	CREATE TABLE IF NOT EXISTS messages (
		id uuid,
		conversation_id uuid,
		sender_id uuid,
		recipient_id uuid,
		content text,
		seen_at timestamp,
		created_at timestamp,
		updated_at timestamp,
		PRIMARY KEY ((conversation_id), created_at, seen_at, id)
	)
	WITH CLUSTERING ORDER BY (created_at DESC)
	AND compression = {'sstable_compression': 'LZ4Compressor'};
	"""
)