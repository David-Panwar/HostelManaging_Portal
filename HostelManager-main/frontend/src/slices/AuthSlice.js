import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    currentAuth : JSON.parse(localStorage.getItem("currentAuth")) || false,
    userid : JSON.parse(localStorage.getItem("userid")) || "",  
    username :JSON.parse(localStorage.getItem("username")) || "",
    role : JSON.parse(localStorage.getItem("role")) || ""
    
}

console.log(initialState.currentAuth)

const AuthSlice = createSlice({
    name : "auth",
    initialState ,

    reducers:{
        setAuth : (state , action)=>{
            const { isAuth , userid , username, role} = action.payload
            state.currentAuth = isAuth
            state.userid =  userid 
            state.username = username
            state.role = role || ""


            localStorage.setItem("currentAuth" , JSON.stringify(isAuth))
            localStorage.setItem("userid" , JSON.stringify(userid))
            localStorage.setItem("username" , JSON.stringify(username))
            localStorage.setItem("role" , JSON.stringify(role || ""))
        },

        getAuth : (state , action)=>{
            return state.currentAuth
        },

        getuser : (state , action)=>{
           return state 
        }

    }
})


export const {setAuth ,getAuth} = AuthSlice.actions

export default AuthSlice.reducer