import {
  BrowserRouter,
  Routes,
  Route,

} from "react-router-dom";

import Category from "./pages/category";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Category />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}




export default App;
