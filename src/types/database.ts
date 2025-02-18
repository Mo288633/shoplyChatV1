// Update the User interface
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  position?: string;
  profileImage?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings?: UserSettings;
}