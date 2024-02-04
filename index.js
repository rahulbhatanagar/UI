// const promiseOne = new Promise(function (resolve,reject){
//     setTimeout(function(){
//         console.log("This is my function");
//         resolve();
//     },5000)
// });

// promiseOne.then(()=> console.log("Hi")).catch(function(error){
//     console.log(error);
// })

//https://dummy.restapiexample.com/api/v1/employee/1 -> Need to do fetch call

const data = fetch(`https://dummyjson.com/user/1`)
console.log(data);
data.then((res,rej)=>{
    if(res.status == 200)
        return res.json()
    else
        console.log(res.json);
}).then((res)=>{
    console.log(res)
    tagP.textContent = 
    "id : "+res.id+", First-Name : "+res.firstName+", Last-Name "+res.lastName+
    ", age : "+res.age + ", bloodGroup : "+res.bloodGroup
})
.catch((rej)=>console.log(rej))

let c = false;
function dev(h,image){
    const getAllUlElements = document.getElementsByTagName('a').item(h).parentElement
    getAllUlElements.style.backgroundColor = 'green'
    let result;
    let img;
    if(c == false){
        img = document.createElement('img')
        img.src = image
        img.style.width = '600px'
        img.style.height = '140px'
        img.style.marginLeft = '250px'
        result = document.getElementById('clicked')
        result.appendChild(img)
        tagP.textContent = ''
        c = true;
    }
    const rmUnderline = document.getElementsByTagName('a').item(h)
    console.log(rmUnderline);
    rmUnderline.style.textDecoration = 'none';

    rmUnderline.addEventListener('mouseleave',function(){
        rmUnderline.style.textDecoration = 'underline'
        getAllUlElements.style.backgroundColor = 'blueviolet'
        if(c == true){
            result.removeChild(img)
            c = false;
        }
            
    })
}

const tagP = document.getElementById('display')
let area = document.getElementById('draw');
function getMousePoints(){
    area.addEventListener('mousemove',function(event){
        area.style.backgroundColor = 'yellow';
        tagP.textContent = event.clientX + " :: " + event.clientY
    })
    area.addEventListener('mouseleave',function(){
        area.style.backgroundColor = 'white';
        tagP.textContent = 'Hi'
        tagP.addEventListener('click',()=>{
            tagP.remove();
        })
    })
}

