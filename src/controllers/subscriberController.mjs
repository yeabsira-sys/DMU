import { Subscriber } from '../models/subscriber.mjs'


export const createSubscriber = async (req, res) => {
try {
    const {email} = req.body
    
    const isEmailExist = await Subscriber.exists({email})
    if(isEmailExist) return res.status(403).json({message: 'the email account is reserved'})

    const subscrib = await Subscriber.create({email})
    if(!subscrib) return res.status(400).json({message: 'could not subscrib'})
    return res.status(201).json({message: subscrib})
} catch (error) {
    return res.status(500).json(error)
}
    
}
export const toggleSubscriber = async (req, res) => {
try {
     const {email} = req.body
    
    const isEmailExist = await Subscriber.exists({email})
    if(!isEmailExist) return res.status(403).json({message: `there is no subscription with : ${email}`})

    const subscriber = await Subscriber.findOne({email})
            subscriber.isActive = (!subscriber.isActive)
            await subscriber.save()
            return res.status(200).json({subscriber})
} catch (error) {
    return res.status(500).json(error)
}
   
}

export const getAllSubscriber = async (req, res ) => {
    try {
        if(req.user?.role !== 'admin') return res.sendStatus(401);
    const {isActive, limit = 10, page = 1 } = req.query
    let filter = {}
    if(isActive) filter.isActive = isActive
        const skip = (page - 1) * limit;
        const subscriber = await Subscriber.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
    const total = await Subscriber.countDocuments(filter)
    const payload = {
        total,
        page,
        limit,
        subscriber: subscriber
    }
    res.status(200).json(payload)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getSubscriberByEmail  = async (req,res) => {
     try {
        if(req.user?.role !== 'admin') return res.sendStatus(401);
        const email = req.params.email
        const subscriber = await Subscriber.findOne({email})
          if(!subscriber) return res.status(404).json({message: `there is no subscriber with email ${email}`})
            return res.status(200).json({subscriber})
    } catch (error) {
        return res.status(500).json(error)
    }
}

