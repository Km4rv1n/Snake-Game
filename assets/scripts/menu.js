
const speedModal = document.getElementById("speedModal")
const instructionsModal = document.getElementById("instructionsModal");

document.getElementById("playBtn").addEventListener("click",function(){
    window.location.href = "index.html";
});


document.getElementById("speedBtn").addEventListener("click",function(){
    speedModal.hidden = false;
});

document.getElementById("closeSpeedSpn").addEventListener("click",function(){
    speedModal.hidden = true;
});

document.getElementById("clearBtn").addEventListener("click",function(){
    localStorage.clear();
    document.getElementById("clearSpn").textContent="High score cleared successfully!"

    setTimeout(() => {
        document.getElementById("clearSpn").textContent=""
    }, 2000);
});

document.getElementById("instructionsBtn").addEventListener("click",function(){
    instructionsModal.hidden = false;
})

document.getElementById("closeInstructionsSpn").addEventListener("click",function(){
    instructionsModal.hidden = true;
})

const speedOptions = document.querySelectorAll(".speedOption");

function removeBorders(){
speedOptions.forEach(option => {
    option.style.border = "none";
});
}

document.getElementById("slowBtn").addEventListener("click",function(){
    localStorage.setItem("speed",150);
    removeBorders();
    document.getElementById("slowBtn").style.border = "2px solid #39FF14";
})

document.getElementById("mediumBtn").addEventListener("click",function(){
    localStorage.setItem("speed",100);
    removeBorders();
    document.getElementById("mediumBtn").style.border = "2px solid #39FF14";
})

document.getElementById("fastBtn").addEventListener("click",function(){
    localStorage.setItem("speed",75);
    removeBorders();
    document.getElementById("fastBtn").style.border = "2px solid #39FF14";
})

