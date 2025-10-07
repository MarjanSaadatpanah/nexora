import React from 'react'

const StatusBadge = ({ status }) => {
    return (
        <div>
            {status === "SIGNED" ? (
                <div className='text-xs mb-2 rounded-tl-lg rounded-br-lg shadow text-white w-20 text-center py-1 bg-green-500'>{status}</div>
            ) : status === "CLOSED" ? (
                <div className='text-xs mb-2 rounded-tl-lg rounded-br-lg shadow text-white w-20 text-center py-1 bg-red-500'>{status}</div>
            ) : (
                <div className='text-xs mb-2 rounded-tl-lg rounded-br-lg shadow text-white w-20 text-center py-1 bg-gray-500'>{status}</div>
            )}
        </div>
    )
}

export default StatusBadge
