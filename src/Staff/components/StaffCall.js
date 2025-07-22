import { Bell } from "lucide-react";
import { Button } from "react-bootstrap";
import React, { useState } from "react";
import { Badge } from "react-bootstrap";
import { useEffect } from "react";


const StaffCall = () => {
    const [calls, setCalls] = useState([]);
    const [showCalls, setShowCalls] = useState(false);
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);

    useEffect(() => {
        fetch('http://localhost:9999/staffCalls')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setCalls(data);
            })
    }, [])

       useEffect(() => {
        fetch('http://localhost:9999/tables')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTables(data);
            })
    }, [])

       useEffect(() => {
        fetch('http://localhost:9999/orders')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setOrders(data);
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

    const tableIsActive =  (tableId) => orders.some(order => Number(order.tableId) === Number(tableId) && order.status === 'pending') || null;

    const pendingCallsNumber = calls.filter(call => call.status === 'pending').length;

    const pendingCalls = calls.filter(call => call.status === 'pending');

    return (
        <div>
            {showCalls && (
                pendingCalls.length > 0 ? (
                    pendingCalls.map((c) => (
                        <div key={c.id} className="staff-call-box">Table {c.tableId} is calling for staff from {c.time}
                            <Button size="sm" onClick={() => receiveCall(c.id)}> Receive</Button>
                        </div>
                    ))
                ) : (
                    <p>No pending calls</p>
                )
            )}
            <Button className="staff-call-btn"
                onClick={() => setShowCalls(!showCalls)}>
                <Bell style={{ marginRight: "10px" }} />
                <Badge className="staff-call-badge">
                    {pendingCallsNumber > 0 ? pendingCallsNumber : "0"}
                </Badge>
            </Button>
        </div>
    )
}
export default StaffCall;