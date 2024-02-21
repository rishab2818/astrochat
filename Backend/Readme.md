**Testing Documentation for Chat App Backend**

1. **Running the App**:
   - Ensure that Node.js and npm are installed on your system.
   - Clone the repository containing the backend code for the chat application.
   - Navigate to the project directory in your terminal.
   - Install dependencies using the command: `npm install`.
   - Start the backend server using: `npm start`.

2. **User Registration**:
   - **URL**: `POST /register`
   - **Method**: POST
   - **Request JSON**:
     ```json
     {
       "name": "John Doe",
       "userId": "johndoe123",
       "phoneNumber": "+1234567890",
       "email": "johndoe@example.com",
       "password": "password123",
       "fcmToken": "valid_FCM_token_here"
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

3. **User Login**:
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

4. **Sending Message**:
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

5. **Reading Messages**:
   - **URL**: `GET /messages`
   - **Method**: GET
   - **Query Parameters**:
     - `senderUserId`: johndoe123
     - `receiverUserId`: janedoe456
   - **Expected Response**:
     - Status: 200 OK
     - Content: Array of message objects
