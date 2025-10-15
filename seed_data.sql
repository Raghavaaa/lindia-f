-- Seed data for legalindia-database

-- Insert users
INSERT INTO users (name, email, password_hash, role) VALUES
('Amit Sharma', 'amit.sharma@legalindia.ai', '$2b$12$dummy_hash_1', 'lawyer'),
('Priya Patel', 'priya.patel@legalindia.ai', '$2b$12$dummy_hash_2', 'lawyer');

-- Insert clients
INSERT INTO clients (lawyer_id, name, contact, address) VALUES
(1, 'Tech Solutions Pvt Ltd', '+91-9876543210', 'Mumbai, Maharashtra'),
(2, 'Green Properties LLC', '+91-9876543211', 'Delhi, NCR');

-- Insert a case
INSERT INTO cases (client_id, title, status, description) VALUES
(1, 'Contract Dispute Resolution', 'active', 'Dispute over service level agreement breach');

-- Insert a property opinion
INSERT INTO property_opinions (client_id, document_url, status, notes) VALUES
(2, 'https://storage.example.com/docs/prop_123.pdf', 'pending', 'Initial review requested for land title verification');

