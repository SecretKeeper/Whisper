from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider

auth_provider = PlainTextAuthProvider(username='cassandra', password='cassandra')

cluster = Cluster(['127.0.0.1'], port=9042, auth_provider=auth_provider)
session = cluster.connect('messages')

session.execute(
	"""
	CREATE TABLE messages (
		id uuid,
		sender text,
		receiver text,
		content text,
		created_at timestamp,
		PRIMARY KEY ((sender, receiver), created_at)
	) WITH CLUSTERING ORDER BY (created_at DESC);
	"""
)