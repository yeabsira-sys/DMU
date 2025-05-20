import  {AuditLogs}  from '../models/Auditlogs.mjs'
import connectDB from '../config/db.mjs'
export const logAction = async (auditData) => {
    try {
        
    await connectDB()
        const auditlog = await AuditLogs.create(auditData);
    if(!auditlog) return({"status": "success"}) 

    return({"status": "fail"})
    } catch (error) {
         console.error("error from audit logger : ", error.stack)
        return({"status": "fail"})
    }
    
}