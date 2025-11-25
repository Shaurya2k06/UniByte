const Events = require("../Model/Events");
const { verifyUserAuth } = require("../Service/authService");
require('dotenv').config();


async function createEvent(req, res) {
    try {
        const user = await verifyUserAuth(req);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const {
            eventName,
            eventLocation,
            eventDescription,
            eventDate,
            amountToBePaid,
            eventImageUrl,
            tags,
        } = req.body;


        if (!eventName || !eventLocation || !eventDescription || !eventDate || !amountToBePaid) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newEvent = new Events({
            eventName,
            eventLocation,
            eventDescription,
            eventDate : new Date(eventDate),
            eventPostedDate : new Date(),
            eventOrganiser: user._id,
            amountToBePaid,
            eventImageUrl,
            tags : tags || [],
        })

        const savedEvent = await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: savedEvent });
    } catch (post_Event_Error) {
        if (post_Event_Error.message === 'Unauthorized, No token provided' || 
            post_Event_Error.message === 'Invalid token payload: no user identification found') {
            return res.status(401).json({ message: post_Event_Error.message });
        }
        console.error('Error posting event:', post_Event_Error);
        res.status(500).json({ message: 'Internal Server Error', error: post_Event_Error.message });
    }
}

async function eventsRegistration(req, res) {
    try {
        const user = await verifyUserAuth(req);
        if(!user) res.status(404).json({message : 'User not found'})
        const eventId = req.body.eventId;
        const event = await Events.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (user.events.includes(eventId)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        user.events.push(eventId);
        await user.save();

        res.status(200).json({ message: 'Successfully registered for the event' });
    } catch (event_reg_error) {
        console.error('Register error:', event_reg_error);
        res.status(500).json({ message: 'Server error', error: event_reg_error.message });
    }
}

async function searchEvents(req, res) {
    try {
        const { query } = req.query;
        if (!query || query.trim() === '') {
            return res.status(400).json({ message: 'Search query cannot be empty' });
        }

        const regex = new RegExp(query, 'i');
        const now = new Date();

        const events = await Events.find({ eventDate: { $gte: now } })
            .populate('eventOrganiser', 'userName userEmail');

        const filteredEvents = events.filter(event =>
            regex.test(event.eventName) ||
            (Array.isArray(event.tags) && event.tags.some(tag => regex.test(tag))) ||
            (event.eventOrganiser && regex.test(event.eventOrganiser.userName))
        );

        return res.status(200).json(filteredEvents);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function getRegisteredEvent(req, res) {
    try {
        const user = await verifyUserAuth(req, { select: '-password', populate: 'events' });

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const now = new Date();
        const upcoming = user.events.filter(events => new Date(events.eventDate) >= now);

        return res.status(200).json({
           upcoming,
        });
    } catch (get_User_Error) {
        console.log(get_User_Error);
        if (get_User_Error.message === 'Unauthorized, No token provided') {
            return res.status(401).json({ message: get_User_Error.message });
        }
        if (get_User_Error.message === 'Invalid token payload: no user identification found') {
            return res.status(400).json({ message: get_User_Error.message });
        }
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

async function getAllEvent(req, res) {
    try {
        const user = await verifyUserAuth(req, { select: '-password', populate: 'events' });

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const now = new Date();
        const upcoming = await Events.find({eventDate : { $gte: now }});

        return res.status(200).json(
            upcoming,
        );
    } catch (get_User_Error) {
        console.log(get_User_Error);
        if (get_User_Error.message === 'Unauthorized, No token provided') {
            return res.status(401).json({ message: get_User_Error.message });
        }
        if (get_User_Error.message === 'Invalid token payload: no user identification found') {
            return res.status(400).json({ message: get_User_Error.message });
        }
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}



module.exports = {
    createEvent,
    eventsRegistration,
    searchEvents,
    getRegisteredEvent,
    getAllEvent
};
