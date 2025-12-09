#!/bin/bash

# Test Authentication API - Tech Help Desk
# This script tests the JWT authentication and role-based authorization system

BASE_URL="http://localhost:3000"

echo "========================================="
echo "Tech Help Desk - Authentication Testing"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Register Admin User
echo -e "${YELLOW}Test 1: Register Admin User${NC}"
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin Test",
    "role": "administrador"
  }')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$ADMIN_TOKEN" ]; then
  echo -e "${GREEN}✓ Admin registered successfully${NC}"
  echo "Token: ${ADMIN_TOKEN:0:20}..."
else
  echo -e "${RED}✗ Admin registration failed${NC}"
  echo "Response: $ADMIN_RESPONSE"
fi
echo ""

# Test 2: Register Técnico User
echo -e "${YELLOW}Test 2: Register Técnico User${NC}"
TECNICO_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tecnico@test.com",
    "password": "tecnico123",
    "name": "Técnico Test",
    "role": "tecnico"
  }')

TECNICO_TOKEN=$(echo $TECNICO_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TECNICO_TOKEN" ]; then
  echo -e "${GREEN}✓ Técnico registered successfully${NC}"
  echo "Token: ${TECNICO_TOKEN:0:20}..."
else
  echo -e "${RED}✗ Técnico registration failed${NC}"
  echo "Response: $TECNICO_RESPONSE"
fi
echo ""

# Test 3: Register Cliente User
echo -e "${YELLOW}Test 3: Register Cliente User${NC}"
CLIENTE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@test.com",
    "password": "cliente123",
    "name": "Cliente Test",
    "role": "cliente"
  }')

CLIENTE_TOKEN=$(echo $CLIENTE_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -n "$CLIENTE_TOKEN" ]; then
  echo -e "${GREEN}✓ Cliente registered successfully${NC}"
  echo "Token: ${CLIENTE_TOKEN:0:20}..."
else
  echo -e "${RED}✗ Cliente registration failed${NC}"
  echo "Response: $CLIENTE_RESPONSE"
fi
echo ""

# Test 4: Login with Admin
echo -e "${YELLOW}Test 4: Login with Admin${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
  echo -e "${GREEN}✓ Admin login successful${NC}"
else
  echo -e "${RED}✗ Admin login failed${NC}"
  echo "Response: $LOGIN_RESPONSE"
fi
echo ""

# Test 5: Access Profile (Admin)
echo -e "${YELLOW}Test 5: Access Profile with Admin Token${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "administrador"; then
  echo -e "${GREEN}✓ Profile access successful${NC}"
  echo "User: $(echo $PROFILE_RESPONSE | grep -o '"name":"[^"]*' | cut -d'"' -f4)"
else
  echo -e "${RED}✗ Profile access failed${NC}"
  echo "Response: $PROFILE_RESPONSE"
fi
echo ""

# Test 6: Admin Access to Users (Should Succeed)
echo -e "${YELLOW}Test 6: Admin Access to Users Endpoint${NC}"
USERS_ADMIN=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_CODE=$(echo "$USERS_ADMIN" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Admin can access users endpoint (200)${NC}"
else
  echo -e "${RED}✗ Admin access failed (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 7: Técnico Access to Users (Should Fail with 403)
echo -e "${YELLOW}Test 7: Técnico Access to Users Endpoint (Should be Forbidden)${NC}"
USERS_TECNICO=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $TECNICO_TOKEN")

HTTP_CODE=$(echo "$USERS_TECNICO" | tail -n1)
if [ "$HTTP_CODE" = "403" ]; then
  echo -e "${GREEN}✓ Técnico correctly forbidden from users endpoint (403)${NC}"
else
  echo -e "${RED}✗ Unexpected response (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 8: Cliente Access to Users (Should Fail with 403)
echo -e "${YELLOW}Test 8: Cliente Access to Users Endpoint (Should be Forbidden)${NC}"
USERS_CLIENTE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $CLIENTE_TOKEN")

HTTP_CODE=$(echo "$USERS_CLIENTE" | tail -n1)
if [ "$HTTP_CODE" = "403" ]; then
  echo -e "${GREEN}✓ Cliente correctly forbidden from users endpoint (403)${NC}"
else
  echo -e "${RED}✗ Unexpected response (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 9: Unauthenticated Access (Should Fail with 401)
echo -e "${YELLOW}Test 9: Unauthenticated Access (Should be Unauthorized)${NC}"
UNAUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users")

HTTP_CODE=$(echo "$UNAUTH_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ Unauthenticated request correctly rejected (401)${NC}"
else
  echo -e "${RED}✗ Unexpected response (HTTP $HTTP_CODE)${NC}"
fi
echo ""

echo "========================================="
echo "Testing Complete!"
echo "========================================="
