# UI Agent User Profile Guide

## Overview
This guide provides the essential user information needed for the UI agent to effectively use user profile data across different pages in the DOF (Department of Finance) application.

## Required User Information

### 1. Authentication Data
- **Token**: JWT stored in `localStorage.getItem('authToken')`
- **User ID**: Unique identifier for the user
- **Authentication Status**: Check if user is logged in

### 2. Core User Profile Fields

#### Essential Fields (Always Available)
```javascript
{
  id: "string",           // User's unique identifier
  full_name: "string",    // User's full name (fallback: name, username)
  username: "string",     // Login username
  role: "string"          // User role: Employee|Head of Department|Manager|Super Admin
}
```

#### Extended Profile Fields (May Vary)
```javascript
{
  gender: "string",              // 'male'|'female' (used for UI personalization)
  phone: "string",               // Phone number (fallback: phoneNumber)
  department: "string",          // Department name (fallback: departmentName)
  specialist: "string",          // Specialization (fallback: specialization)
  college: "string",             // College name (fallback: collegeName)
  departmentId: "number",        // Department ID for API calls
  collegeId: "number"            // College ID for API calls
}
```

## Data Access Patterns

### 1. From localStorage (Cached Data)
```javascript
// Get cached user data
const userData = JSON.parse(localStorage.getItem('authUser') || '{}');

// Check authentication status
const isAuthenticated = !!localStorage.getItem('authToken');
```

### 2. From API (Fresh Data)
```javascript
// Fetch fresh profile data
const response = await fetch('http://localhost:3000/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
const userData = data?.data?.user;
```

## UI Implementation Guidelines

### 1. Display Name Logic
```javascript
const displayName = userData.full_name || userData.name || userData.username;
```

### 2. Gender-Based UI Personalization
```javascript
const isMale = userData.gender === 'male';
const isFemale = userData.gender === 'female';
const genderText = userData.gender === 'male' ? 'ذكر' : 
                   userData.gender === 'female' ? 'أنثى' : userData.gender;
```

### 3. Profile Details with Fallbacks
```javascript
const profileDetails = [
  { 
    label: "الجنس", 
    value: userData.gender === 'male' ? 'ذكر' : 
           userData.gender === 'female' ? 'أنثى' : userData.gender 
  },
  { 
    label: "الهاتف", 
    value: userData.phone || userData.phoneNumber 
  },
  { 
    label: "القسم", 
    value: userData.department || userData.departmentName 
  },
  { 
    label: "الاختصاص", 
    value: userData.specialist || userData.specialization 
  },
  { 
    label: "الكلية", 
    value: userData.college || userData.collegeName 
  }
].filter(detail => detail.value != null && detail.value !== '');
```

## Error Handling

### 1. Authentication Errors
- **No Token**: Redirect to `/login`
- **Invalid Token (401)**: Clear localStorage and redirect to `/login`
- **Network Error**: Show error message and retry option

### 2. Data Validation
- Always check if `userData` exists before accessing properties
- Use fallback values for optional fields
- Filter out empty/null values when displaying profile details

## Common Use Cases

### 1. Dashboard Header
- Display user's full name
- Show role-based navigation options
- Implement gender-specific styling

### 2. Profile Page
- Show all available profile information
- Handle missing fields gracefully
- Provide edit functionality for updatable fields

### 3. Role-Based Features
- Check user role for feature access
- Show/hide components based on permissions
- Customize UI based on department/college

## Best Practices

1. **Always validate data** before using it
2. **Use fallback values** for optional fields
3. **Handle loading states** when fetching fresh data
4. **Implement error boundaries** for profile-related components
5. **Cache user data** in localStorage for better performance
6. **Refresh data periodically** or on user actions
7. **Use consistent field mapping** across the application

## API Endpoints

- **Profile Data**: `GET /api/auth/profile`
- **Authentication**: `POST /api/v1/login`
- **Registration**: `POST /api/v1/register`

## Storage Keys

- **Token**: `localStorage.getItem('authToken')`
- **User Data**: `localStorage.getItem('authUser')`

This guide ensures consistent user profile handling across all pages and components in the DOF application.
