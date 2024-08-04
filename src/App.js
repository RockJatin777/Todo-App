import {BrowserRouter, Route, Routes} from 'react-router-dom';

import RegisterFrom from './Component/RegistrationForm';
import LoginForm from './Component/LoginForm';
import Home from "./Component/Home";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/register" Component={RegisterFrom} />
      <Route exact path="/login" Component={LoginForm} />
      <Route exact path="/" Component={Home} />
    </Routes>
  </BrowserRouter>
)

export default App;