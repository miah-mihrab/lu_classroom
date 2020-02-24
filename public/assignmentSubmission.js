//assignmentname
//details
//file

export async function getStudentsAssignments(assignmentId){
    console.log(assignmentId)
    
    try{
    const response = await axios({
        method:"GET",
        url:`/classwork/${assignmentId}`
    });
    console.log(response)
    }catch(err){
        console.log(err);
    }
    

    console.log(response)
}