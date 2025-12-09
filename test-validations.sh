#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${YELLOW}=== Tech Help Desk - Validations Test ===${NC}\n"

# Step 1: Register and login as admin
echo -e "${YELLOW}Step 1: Registering admin user...${NC}"
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "administrador"
  }')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')
ADMIN_ID=$(echo $ADMIN_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

if [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}✗ Failed to get admin token${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Admin registered and logged in${NC}\n"

# Step 2: Register client
echo -e "${YELLOW}Step 2: Registering client user...${NC}"
CLIENT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@test.com",
    "password": "client123",
    "name": "Client User",
    "role": "cliente"
  }')

CLIENT_TOKEN=$(echo $CLIENT_RESPONSE | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')
CLIENT_ID=$(echo $CLIENT_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

if [ -z "$CLIENT_TOKEN" ]; then
  echo -e "${RED}✗ Failed to get client token${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Client registered${NC}\n"

# Step 3: Register technicians
echo -e "${YELLOW}Step 3: Registering technician user...${NC}"
TECH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tech@test.com",
    "password": "tech123",
    "name": "Technician User",
    "role": "tecnico"
  }')

TECH_TOKEN=$(echo $TECH_RESPONSE | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')
TECH_ID=$(echo $TECH_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

if [ -z "$TECH_TOKEN" ]; then
  echo -e "${RED}✗ Failed to get tech token${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Technician registered${NC}\n"

# Step 4: Create category
echo -e "${YELLOW}Step 4: Creating category...${NC}"
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hardware",
    "description": "Problemas de hardware"
  }')

CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

if [ -z "$CATEGORY_ID" ]; then
  echo -e "${RED}✗ Failed to create category${NC}"
  echo "Response: $CATEGORY_RESPONSE"
  exit 1
fi
echo -e "${GREEN}✓ Category created: $CATEGORY_ID${NC}\n"

# === VALIDATION TESTS ===

echo -e "${YELLOW}=== VALIDATION 1: Pipes para DTOs ===${NC}"

# Test 1.1: Create ticket with missing fields
echo -e "${YELLOW}Test 1.1: Creating ticket without required fields...${NC}"
INVALID_RESPONSE=$(curl -s -X POST "$BASE_URL/tickets" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Ticket"
  }')

if echo "$INVALID_RESPONSE" | grep -q "message"; then
  echo -e "${GREEN}✓ Validation rejected invalid DTO${NC}"
else
  echo -e "${RED}✗ Validation did not reject invalid DTO${NC}"
fi
echo ""

# Test 1.2: Create ticket with invalid UUID
echo -e "${YELLOW}Test 1.2: Creating ticket with invalid category UUID...${NC}"
INVALID_UUID_RESPONSE=$(curl -s -X POST "$BASE_URL/tickets" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Test Ticket\",
    \"description\": \"Test Description\",
    \"categoryId\": \"invalid-uuid\",
    \"clientId\": \"$CLIENT_ID\"
  }")

if echo "$INVALID_UUID_RESPONSE" | grep -q "UUID válido"; then
  echo -e "${GREEN}✓ Validation rejected invalid UUID format${NC}"
else
  echo -e "${RED}✗ Validation did not reject invalid UUID${NC}"
fi
echo ""

echo -e "${YELLOW}=== VALIDATION 2: Ticket sin categoría/cliente válido ===${NC}"

# Test 2.1: Create ticket without valid category
echo -e "${YELLOW}Test 2.1: Creating ticket with non-existent category...${NC}"
NO_CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/tickets" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Test Ticket\",
    \"description\": \"Test Description\",
    \"categoryId\": \"00000000-0000-0000-0000-000000000000\",
    \"clientId\": \"$CLIENT_ID\"
  }")

if echo "$NO_CATEGORY_RESPONSE" | grep -q "no encontrada"; then
  echo -e "${GREEN}✓ Cannot create ticket without valid category${NC}"
else
  echo -e "${RED}✗ Should not allow ticket without valid category${NC}"
  echo "Response: $NO_CATEGORY_RESPONSE"
fi
echo ""

# Test 2.2: Create valid ticket
echo -e "${YELLOW}Test 2.2: Creating valid ticket...${NC}"
TICKET_RESPONSE=$(curl -s -X POST "$BASE_URL/tickets" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"My Laptop Won't Start\",
    \"description\": \"The power button doesn't work\",
    \"categoryId\": \"$CATEGORY_ID\",
    \"clientId\": \"$CLIENT_ID\",
    \"priority\": \"high\"
  }")

TICKET_ID=$(echo $TICKET_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

if [ -z "$TICKET_ID" ]; then
  echo -e "${RED}✗ Failed to create valid ticket${NC}"
  echo "Response: $TICKET_RESPONSE"
  exit 1
fi
echo -e "${GREEN}✓ Valid ticket created: $TICKET_ID${NC}\n"

echo -e "${YELLOW}=== VALIDATION 3: Técnico con máximo 5 tickets en progreso ===${NC}"

# Create 5 tickets and assign to technician
echo -e "${YELLOW}Creating 5 tickets in progress for technician...${NC}"
for i in {1..5}; do
  TEMP_TICKET=$(curl -s -X POST "$BASE_URL/tickets" \
    -H "Authorization: Bearer $CLIENT_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"Ticket $i\",
      \"description\": \"Description $i\",
      \"categoryId\": \"$CATEGORY_ID\",
      \"clientId\": \"$CLIENT_ID\"
    }")
  
  TEMP_TICKET_ID=$(echo $TEMP_TICKET | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)
  
  # Assign to technician
  curl -s -X PATCH "$BASE_URL/tickets/$TEMP_TICKET_ID/assign" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"technicianId\": \"$TECH_ID\"}" > /dev/null
  
  echo "  Ticket $i assigned"
done
echo -e "${GREEN}✓ Created and assigned 5 tickets${NC}\n"

# Try to assign a 6th ticket
echo -e "${YELLOW}Test 3.1: Trying to assign 6th ticket to technician...${NC}"
SIXTH_TICKET=$(curl -s -X POST "$BASE_URL/tickets" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Sixth Ticket\",
    \"description\": \"This should fail\",
    \"categoryId\": \"$CATEGORY_ID\",
    \"clientId\": \"$CLIENT_ID\"
  }")

SIXTH_TICKET_ID=$(echo $SIXTH_TICKET | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)

WORKLOAD_RESPONSE=$(curl -s -X PATCH "$BASE_URL/tickets/$SIXTH_TICKET_ID/assign" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"technicianId\": \"$TECH_ID\"}")

if echo "$WORKLOAD_RESPONSE" | grep -q "máximo de 5 tickets"; then
  echo -e "${GREEN}✓ Technician workload validation works (rejected 6th ticket)${NC}"
else
  echo -e "${RED}✗ Should not allow more than 5 tickets in progress${NC}"
  echo "Response: $WORKLOAD_RESPONSE"
fi
echo ""

echo -e "${YELLOW}=== VALIDATION 4: Transición de estados ===${NC}"

# Create a fresh ticket for status tests
echo -e "${YELLOW}Creating fresh ticket for status tests...${NC}"
STATUS_TICKET=$(curl -s -X POST "$BASE_URL/tickets" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Status Test Ticket\",
    \"description\": \"For testing status transitions\",
    \"categoryId\": \"$CATEGORY_ID\",
    \"clientId\": \"$CLIENT_ID\"
  }")

STATUS_TICKET_ID=$(echo $STATUS_TICKET | grep -o '"id":"[^"]*' | grep -o '[^"]*$' | head -1)
echo -e "${GREEN}✓ Status test ticket created${NC}\n"

# Test 4.1: Valid transition ABIERTO -> EN_PROGRESO
echo -e "${YELLOW}Test 4.1: Valid transition (abierto -> en_progreso)...${NC}"
VALID_TRANSITION=$(curl -s -X PATCH "$BASE_URL/tickets/$STATUS_TICKET_ID/status" \
  -H "Authorization: Bearer $TECH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "en_progreso"}')

if echo "$VALID_TRANSITION" | grep -q "en_progreso"; then
  echo -e "${GREEN}✓ Valid transition accepted${NC}"
else
  echo -e "${RED}✗ Valid transition rejected${NC}"
  echo "Response: $VALID_TRANSITION"
fi
echo ""

# Test 4.2: Invalid transition EN_PROGRESO -> CERRADO (skip RESUELTO)
echo -e "${YELLOW}Test 4.2: Invalid transition (en_progreso -> cerrado, skipping resuelto)...${NC}"
INVALID_TRANSITION=$(curl -s -X PATCH "$BASE_URL/tickets/$STATUS_TICKET_ID/status" \
  -H "Authorization: Bearer $TECH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "cerrado"}')

if echo "$INVALID_TRANSITION" | grep -q "Transición de estado inválida"; then
  echo -e "${GREEN}✓ Invalid transition correctly rejected${NC}"
else
  echo -e "${RED}✗ Should reject invalid transition${NC}"
  echo "Response: $INVALID_TRANSITION"
fi
echo ""

# Test 4.3: Valid transition EN_PROGRESO -> RESUELTO
echo -e "${YELLOW}Test 4.3: Valid transition (en_progreso -> resuelto)...${NC}"
VALID_TRANSITION2=$(curl -s -X PATCH "$BASE_URL/tickets/$STATUS_TICKET_ID/status" \
  -H "Authorization: Bearer $TECH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "resuelto"}')

if echo "$VALID_TRANSITION2" | grep -q "resuelto"; then
  echo -e "${GREEN}✓ Valid transition accepted${NC}"
else
  echo -e "${RED}✗ Valid transition rejected${NC}"
fi
echo ""

# Test 4.4: Valid transition RESUELTO -> CERRADO
echo -e "${YELLOW}Test 4.4: Valid transition (resuelto -> cerrado)...${NC}"
VALID_TRANSITION3=$(curl -s -X PATCH "$BASE_URL/tickets/$STATUS_TICKET_ID/status" \
  -H "Authorization: Bearer $TECH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "cerrado"}')

if echo "$VALID_TRANSITION3" | grep -q "cerrado"; then
  echo -e "${GREEN}✓ Valid transition accepted${NC}"
else
  echo -e "${RED}✗ Valid transition rejected${NC}"
fi
echo ""

# Test 4.5: No transition from CERRADO
echo -e "${YELLOW}Test 4.5: Cannot transition from cerrado...${NC}"
NO_TRANSITION=$(curl -s -X PATCH "$BASE_URL/tickets/$STATUS_TICKET_ID/status" \
  -H "Authorization: Bearer $TECH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "abierto"}')

if echo "$NO_TRANSITION" | grep -q "Transición de estado inválida"; then
  echo -e "${GREEN}✓ Correctly rejected transition from closed state${NC}"
else
  echo -e "${RED}✗ Should not allow transitions from closed state${NC}"
fi
echo ""

echo -e "${GREEN}=== All validation tests completed! ===${NC}"
