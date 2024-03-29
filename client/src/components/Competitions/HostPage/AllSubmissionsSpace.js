import React, { useEffect, useState } from 'react'

const AllSubmissionsSpace = ({ l, index }) => {
    const [updatedAt, setUpdatedAt] = useState("0 sec ago");
    var s = {
        day: 86400, // feel free to add your own row
        hour: 3600,
        min: 60,
        sec: 1,
    };
    useEffect(() => {
        if (l) {
            var r = {};
            let present = new Date();
            let start = new Date(l.updatedAt);
            var d = Math.abs(start - present) / 1000;
            Object.keys(s).every((key) => {
                r[key] = Math.floor(d / s[key]);
                d -= r[key] * s[key];
                if (r[key] !== 0) {
                    // if (r[key] === 1) {
                    //     setUpdatedAt(`${r[key]} ${key.slice(0, -1)} ago`);
                    // } else {
                    setUpdatedAt(`${r[key]} ${key} ago`);
                    // }
                    return false;
                }
                return true;
            })
        }
    }, [l]);

    return (
        <>
            <tr>
                <th scope="row">{index + 1}</th>
                {/* <th>{names[index]}</th> */}
                <th>{l.team}</th>
                <th>{l.maxPublicScore['$numberDecimal'].toLocaleString()}</th>
                <th>{l.maxPrivateScore['$numberDecimal'].toLocaleString()}</th>
                <th>{l.numSubmissions}</th>
                <th>{updatedAt}</th>
            </tr>
        </>
    )
}

export default AllSubmissionsSpace