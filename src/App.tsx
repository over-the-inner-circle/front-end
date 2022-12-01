import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer, Slide } from 'react-toastify';

import Intro from '@/pages/Intro';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Main from '@/pages/Main';

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/login/:provider" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/main" element={<Main />} />
          </Routes>
          <ToastContainer
            position="top-center"
            theme="dark"
            transition={Slide}
            closeOnClick={false}
            closeButton={true}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
