"use client";

import {
  DarkThemeToggle,
  Drawer,
  Navbar,
  Sidebar,
  useThemeMode,
} from "flowbite-react";
import Link from "next/link";
import { useState } from "react";
import { BiArrowFromLeft } from "react-icons/bi";
import { CgMenuLeftAlt } from "react-icons/cg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleMode, mode } = useThemeMode();
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Navbar fluid rounded className="bg-blue-400 dark:bg-neutral-950">
        <Navbar.Brand>
          <CgMenuLeftAlt
            className="self-center text-2xl cursor-pointer mr-2 dark:text-white"
            onClick={() => setIsOpen(true)}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Task Manager
          </span>
        </Navbar.Brand>

        <div className="flex md:order-2">
          <DarkThemeToggle />
        </div>
      </Navbar>
      <Drawer open={isOpen} onClose={handleClose}>
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item icon={BiArrowFromLeft} as={Link} href="/">
                      Home
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item icon={BiArrowFromLeft} as={Link} href="/user">
                      User
                    </Sidebar.Item>
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default Header;

// "use client";

// import {
//   DarkThemeToggle,
//   Drawer,
//   Navbar,
//   Sidebar,
//   useThemeMode,
// } from "flowbite-react";
// import Link from "next/link";
// import { useState } from "react";
// import { BiArrowFromLeft } from "react-icons/bi";
// import { CgMenuLeftAlt } from "react-icons/cg";
// import { FaRegSun } from "react-icons/fa";
// import { LuMoon } from "react-icons/lu";
// // import { Link, useNavigate } from "react-router-dom";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   // const navigate = useNavigate();
//   const { toggleMode, mode } = useThemeMode();
//   const handleClose = () => setIsOpen(false);

//   return (
//     <>
//       <Navbar fluid rounded className="bg-blue-400 dark:bg-slate-900">
//         <Navbar.Brand>
//           <CgMenuLeftAlt
//             className="self-center text-2xl cursor-pointer mr-2"
//             onClick={() => setIsOpen(true)}
//           />
//           <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
//             Task Manager
//           </span>
//         </Navbar.Brand>

//         <div className="flex md:order-2">
          
//           <DarkThemeToggle />
//         </div>
//       </Navbar>
//       <Drawer open={isOpen} onClose={handleClose}>
//         <Drawer.Header title="MENU" titleIcon={() => <></>} />
//         <Drawer.Items>
//           <Sidebar
//             aria-label="Sidebar with multi-level dropdown example"
//             className="[&>div]:bg-transparent [&>div]:p-0"
//           >
//             <div className="flex h-full flex-col justify-between py-2">
//               <div>
//                 <Sidebar.Items>
//                   <Sidebar.ItemGroup>
//                     <Sidebar.Item
//                       icon={BiArrowFromLeft}
                     
//                     >
//                       Home
//                     </Sidebar.Item>
//                   </Sidebar.ItemGroup>
//                   <Sidebar.ItemGroup>
//                     <Sidebar.Item
//                       icon={BiArrowFromLeft}
                      
//                     >
//                       User
//                     </Sidebar.Item>
//                   </Sidebar.ItemGroup>
//                 </Sidebar.Items>
//               </div>
//             </div>
//           </Sidebar>
//         </Drawer.Items>
//       </Drawer>
//     </>
//   );
// };

// export default Header;
