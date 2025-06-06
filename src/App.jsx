import './App.css'
import {BrowserRouter,Route, Routes} from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Users from './pages/user/Users';
import ViewUser from './pages/user/ViewUser';
import Login from './auth/Login';
import ProtectedRoute from './component/ProtectedRoute';
import Profile from './auth/Profile';
import EditUser from './pages/user/EditUser';
import EditAdmin from './auth/EditAdmin';
import ViewVideo from './pages/video/ViewVideo';
import EditVideo from './pages/video/EditVideo';
import TermsConditions from './pages/terms_conditions/TermsConditions';
import VideosList from './pages/video/VideosList';
import UploadVideo from './pages/video/UploadVideo';
import Codes from './pages/code/Codes';
import Location from './pages/location/Location';
import { LoadScript, GoogleMap, MarkerF, CircleF } from '@react-google-maps/api';
import ChangePassword from './pages/changepassword/ChangePassword';

function App() {
  
const libraries = ['places'];
  return (
    <>
        <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                  // onError={handleScriptError}
                >
    <BrowserRouter>
    <Routes>
    
 <Route path='/users' element={<ProtectedRoute children={<Users/>}/>}/>
<Route path='/dashboard' element={<ProtectedRoute children={<Dashboard/>}/>}/>
<Route path='/users/:user_id' element={<ProtectedRoute children={<ViewUser/>}/>}/>
<Route path='/user/edit/:user_id' element={<ProtectedRoute children={<EditUser/>}/>}/>
<Route path='/profile' element={<ProtectedRoute children={<Profile/>}/>}/>
<Route path='/profile/edit' element={<ProtectedRoute children={<EditAdmin/>}/>}/>

<Route path='/videos/:id' element={<ProtectedRoute children={<ViewVideo/>}/>}/>

<Route path="/videos/edit/:id" element={<ProtectedRoute children={<EditVideo/>}/>}/>

<Route path='/videos' element={<ProtectedRoute children={<VideosList/>}/>}/>
<Route path='/videos/upload' element={  <ProtectedRoute children={<UploadVideo/>}/>}/>
<Route path='/change-password' element={<ProtectedRoute children={<ChangePassword/>}/>}/>

<Route path='/codes' element={<ProtectedRoute children={<Codes/>}/>}/>

<Route path='/location' element={<ProtectedRoute children={<Location/>}/>}/>


<Route path='/term' element={<TermsConditions/>}/>
<Route path='/' element={<Login/>}/>
    </Routes>
    
    </BrowserRouter>
       </LoadScript>
    </>
  )
}

export default App
