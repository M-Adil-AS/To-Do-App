const createInput = document.querySelector('#createInput')
const createForm = document.querySelector('#createForm')
const taskList = document.querySelector('#taskList')
const sortByDate = document.querySelector('#sortByDate')
const sortByPriority = document.querySelector('#sortByPriority')

const updateData = ()=> {
    let list = []
    document.querySelectorAll('.task').forEach((task)=>{
        const text = task.querySelector('.text').innerHTML
        const priority = task.querySelector('.priority').value
        const status = task.querySelector('.status').checked
        const date = task.querySelector('.date').innerHTML.split(' ')[2]
        list.push({text,priority,status,date})
    })
    localStorage.setItem('list',JSON.stringify(list))
}

const generateTasks = (list)=> {
    list.forEach(({priority,status,text,date})=>{
        taskList.insertAdjacentHTML('beforeend', `
            <li class="task list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="text">${text}</span>
                <div class='labelSelect'>
                    <label>Priority: </label>
                    <select class='priority'>
                        <option ${priority=='Normal' ? 'selected' : null}>Normal</option>
                        <option ${priority=='Low'?'selected':null}>Low</option>
                        <option ${priority=='High'?'selected':null}>High</option>
                        <option ${priority=='Urgent'?'selected':null}>Urgent</option>
                    </select>
                </div>
                <input type="checkbox" class='status' ${status ? 'checked' : null}>
                <span class="date">Created On: ${date}</span>
                <div>
                    <button class="edit-me btn btn-success btn-sm mr-1">Edit</button>
                    <button class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>
            </li>` 
        )
    })
}

const getData = ()=> {
    const list = JSON.parse(localStorage.getItem('list'))
    list && generateTasks(list)
}

getData()

createForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(createInput.value==''){
        alert('Empty value!')
    }
    else{
        const date = new Date()
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const currentDate = `${day}/${month}/${year}`
        taskList.insertAdjacentHTML('afterBegin', `
            <li class="task list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="text">${createInput.value}</span>
                <div class='labelSelect'>
                    <label>Priority: </label>
                    <select class='priority'>
                        <option>Normal</option>
                        <option>Low</option>
                        <option>High</option>
                        <option>Urgent</option>
                    </select>
                </div>
                <input type="checkbox" class='status'>
                <span class="date">Created On: ${currentDate}</span>
                <div>
                    <button class="edit-me btn btn-success btn-sm mr-1">Edit</button>
                    <button class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>
            </li>` 
        )
        createInput.value = ''
        createInput.focus()
        updateData()
    }
})

taskList.addEventListener('click', (e)=>{
    if(e.target.classList.contains('edit-me')){
        const newValue = prompt('Edit the task!')
        if(newValue==''){
            alert('Empty!')
        }
        else if(newValue!='' && newValue){
            e.target.parentElement.parentElement.querySelector('.text').innerHTML = newValue
            updateData()
        }
    }
    else if(e.target.classList.contains('delete-me')){
        const confirmation = confirm('Are you sure you want to delete this task?')
        if(confirmation){
            e.target.parentElement.parentElement.remove()
            updateData()
        }
    }
    else if(e.target.classList.contains('priority') || e.target.classList.contains('status')){
        updateData()
    }
})

sortByPriority.addEventListener('click',()=> {
    let list = JSON.parse(localStorage.getItem('list'))
    if(list){
        document.querySelectorAll('.task').forEach((task)=>{
            task.remove()
        })
    
        const urgents = list.filter(task => task.priority=='Urgent')
        const highs = list.filter(task => task.priority=='High')
        const normals = list.filter(task => task.priority=='Normal')
        const lows = list.filter(task => task.priority=='Low')
    
        list = [...urgents,...highs,...normals,...lows]
        generateTasks(list)
        updateData()
    }
})

sortByDate.addEventListener('click', ()=>{
    let list = JSON.parse(localStorage.getItem('list'))
    if(list){
        document.querySelectorAll('.task').forEach((task)=>{
            task.remove()
        })
    
        for(let i=0; i<list.length-1; i++){
            for(let j=0; j<list.length-1; j++){
                if(isLeftDateRecent(list[j+1].date,list[j].date)){
                    const temp = JSON.parse(JSON.stringify(list[j+1]))
                    list[j+1] = list[j]
                    list[j] = temp
                }
            }
        }
    
        generateTasks(list)
        updateData()
    }
})

const isLeftDateRecent = (leftDate,rightDate)=> {
    const leftDateSplits = leftDate.split('/')
    const rightDateSplits = rightDate.split('/')
    if(Number(leftDateSplits[2]) > Number(rightDateSplits[2])){
        return true
    }
    else if(Number(leftDateSplits[2]) == Number(rightDateSplits[2])){
        if(Number(leftDateSplits[1]) > Number(rightDateSplits[1])){
            return true
        }
        else if(Number(leftDateSplits[1]) == Number(rightDateSplits[1])){
            if(Number(leftDateSplits[0]) > Number(rightDateSplits[0])){
                return true
            }
        }
    }
    return false
}