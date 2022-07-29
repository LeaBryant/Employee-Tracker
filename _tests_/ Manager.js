const Manager = require("../lib/Engineer");

test('Does this create a new employee object', ()=>{
    const emp =  new Manager('Name', 2, "test@email.com")
    expect(emp.name).toBe('Name')
    expect(emp.getName()).toBe('Name')
})

test('Does this track the employee name', ()=>{
    const emp =  new Manager('Name', 2, "test@email.com")
    expect(emp.name).toBe('Name')
    expect(emp.getName()).toBe('Name')
})