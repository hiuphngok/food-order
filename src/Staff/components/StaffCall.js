import { Bell } from "lucide-react";
import { Button } from "react-bootstrap";
import React, { useState } from "react";
import { Badge } from "react-bootstrap";
import { useEffect } from "react";


const StaffCall = () => {
    const [calls, setCalls] = useState([]);
    const [showCalls, setShowCalls] = useState(false);

    useEffect(() => {
        fetch('http://localhost:9999/staffCalls')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setCalls(data);
            })
    }, [])

    const receiveCall = (callId) => {
        const existingCall = calls.find(call => call.id === callId);
        if (!existingCall) return;

        const updatedCall = {
            ...existingCall,
            status: 'received'
        };

        fetch(`http://localhost:9999/staffCalls/${callId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCall),
        })
            .then(response => response.json())
            .then(data => {
                setCalls(calls.map(call => call.id === data.id ? data : call));
            })
            .catch(error => console.error('Error updating call:', error));
    }

    const pendingCallsNumber = calls.filter(call => call.status === 'pending').length;

    const pendingCalls = calls.filter(call => call.status === 'pending');

    return (
        <div>
            {showCalls && (
                pendingCalls.length > 0 ? (
                    pendingCalls.map((c) => (
                        <div key={c.id} variant="primary" className="fixed bottom-0 left-0 w-full bg-blue-600 text-white py-2 d-flex justify-content-center">Table {c.tableId} is calling for staff from {c.callTime}
                            <Button variant="secondary" className="ml-2" onClick={() => receiveCall(c.id)}> Receive</Button>
                        </div>
                    ))
                ) : (
                    <p>No pending calls</p>
                )
            )}
            <Button variant="primary" className="fixed bottom-0 left-0 w-full bg-blue-600 text-white py-2"
                onClick={() => setShowCalls(!showCalls)}>
                <Bell className="inline mr-2" />
                <Badge bg="secondary">
                    {pendingCallsNumber > 0 ? pendingCallsNumber : "0"}
                </Badge>
            </Button>
        </div>
    )
}
export default StaffCall;