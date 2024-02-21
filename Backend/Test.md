**Testing Documentation for Chat App Backend**

1. **User Registration**:
   - **URL**: `POST /register`
   - **Method**: POST
   - **Request JSON**:
     ```json
     {
       "name": "John Doe",
       "userId": "johndoe123",
       "phoneNumber": "+1234567890",
       "email": "johndoe@example.com",
       "password": "password123"
     }
     ```
   - **Expected Response**:
     - Status: 201 Created
     - Content:
       ```json
       {
         "message": "User registered successfully"
       }
       ```

2. **User Login**:
   - **URL**: `POST /login`
   - **Method**: POST
   - **Request JSON**:
     ```json
     {
       "userId": "johndoe123",
       "password": "password123"
     }
     ```
   - **Expected Response**:
     - Status: 200 OK
     - Content:
       ```json
       {
         "message": "Login successful",
         "fcmToken": "<valid FCM token>"
       }
       ```

3. **Sending Message**:
   - **URL**: `POST /send-message`
   - **Method**: POST
   - **Request JSON**:
     ```json
     {
       "senderUserId": "johndoe123",
       "receiverUserId": "janedoe456",
       "message": "Hello Jane, how are you?"
     }
     ```
   - **Expected Response**:
     - Status: 201 Created
     - Content:
       ```json
       {
         "message": "Message sent successfully"
       }
       ```

4. **Reading Messages**:
   - **URL**: `GET /messages`
   - **Method**: GET
   - **Query Parameters**:
     - `senderUserId`: johndoe123
     - `receiverUserId`: janedoe456
   - **Expected Response**:
     - Status: 200 OK
     - Content: Array of message objects
