const chatInput= document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(" .chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbottoggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn=document.querySelector(".close-btn")

let userMessage;
const API_KEY="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";
const inputinitheight=chatInput.scrollHeight;

const generateResponse =(incomingChatLI)=>{
    const API_URL="https://api.openai.com/v1/chat/completions";
    const messageElement=incomingChatLI.querySelector("p");
    const requestOptions ={
        method:"POST",
        headers:{
            "content-type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        body:JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:  userMessage
              }

            ]
        })

    }


    //send post request to api, get reponse

    fetch(API_URL,requestOptions).then(res=>res.json()).then(data=>{
            messageElement.textContent=data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.classList.add(error);
        messageElement.textContent="Oops !something went wrong please try again later";
    }).finally(()=>
    chatbox.scrollTo(0,chatbox.scrollHeight)
    );

}
const createChatLi = (message,className)=>{
    //create  a chat <li> element with passed message and classname
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className==="outgoing"?  `<p></p>`:   ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}

const handleChat=()=>{
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value="";
    chatInput.style.height=`${inputinitheight}px`;
    //append the user message to chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight)
    console.log(userMessage);

    setTimeout(()=>{
        //display thinking message while waitimg for response
        const incomingChatLI=createChatLi("Thinking...","incoming");
        chatbox.appendChild(incomingChatLI);
        chatbox.scrollTo(0,chatbox.scrollHeight)
        generateResponse(incomingChatLI);
    },600);
}


chatInput.addEventListener("input",()=>{
    //adjust height input of  based on its content
    chatInput.style.height=`${inputinitheight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;

})

chatInput.addEventListener("keydown",(e)=>{

    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }

})

sendChatBtn.addEventListener("click",handleChat);

chatbottoggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));