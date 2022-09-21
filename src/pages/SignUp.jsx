import { useState } from "react"
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import { Link } from "react-router-dom";
import { OAuth } from "../components/OAuth";

export const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormDate] = useState({
        name:"",
        email:"",
        password: ""
    })
    const {name, email, password} = formData;
    function onchange(e) {
        setFormDate((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }
    return(
        <section>
            <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
            <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
                <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
                    <img src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                         alt="sign in" 
                         className="w-full rounded-2xl"/>
                </div>
                <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
                    <form>
                        <input type="name" id="name" value={name} onChange={onchange} placeholder="Full name" className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6"/>
                        <input type="email" id="email" value={email} onChange={onchange} placeholder="Email address" className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6"/>
                        <div className="relative mb-6">
                            <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={onchange} placeholder="Password" className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"/>
                            {showPassword ? (
                                <AiFillEyeInvisible className="absolute right-3 top-3 text-xl cursor-pointer" onClick={() => setShowPassword((prevState) => !prevState)}/>
                                ) : (
                                <AiFillEye className="absolute right-3 top-3 text-xl cursor-pointer"  onClick={() => setShowPassword((prevState) => !prevState)}/>
                                )
                            }
                        </div>
                        <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
                            <p className="mb-6">
                                Have an account?
                                <Link to="/sign-in" className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1">Sign In</Link>
                            </p>
                            <p>
                                <Link to="/forget-password" className="text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out ml-1">Forget Password?</Link>
                            </p>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800">Sign Up</button>
                        <div className="my-4 flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                            <p className="text-center font-semibold mx-4 ">OR</p>
                        </div>
                    </form>
                    <OAuth />
                </div>
            </div>
        </section>
    )
}