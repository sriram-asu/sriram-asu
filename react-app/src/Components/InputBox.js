import React, { useState } from 'react';

export default function InputBox() {
  // Declare a new state variable, which we'll call "count"

  const [json, setJson] = useState({
    "overall": 5.0, "verified": true,
    "reviewTime": "10 17, 2015",
    "reviewerID": "A1HP7NVNPFMA4N",
    "asin": "0700026657",
    "reviewerName": "Ambrosia075",
    "reviewText": "This game is a bit hard to get the hang of, but when you do it's great.",
    "summary": "but when you do it's great.",
    "unixReviewTime": 1445040000
  });
  const [input, setInput] = useState('');
  const [created, setCreated] = useState('');

    const postJSon = () => {
      try {
            setJson(JSON.parse(input));
            const requestOptions = {
                    method: 'POST',body: input,
                    headers: { 'Content-Type': 'application/json' }};
            fetch('/post', requestOptions)
            .then(response => setCreated(response.statusText));

          } catch (error) {
          setJson({"error": "Input proper JSON"});
        }
    }
      const onInputChange = (e) => {
        setInput(e.target.value)
      }

  return (
    <div>
      <p>Previous Post was : {created} </p>
      <p>Input Json is </p>
      <div><pre>{JSON.stringify(json, null, 2) }</pre></div>
      <p>
      <button onClick={postJSon}>
        Post
      </button>
      </p>
      <textarea onChange={onInputChange} value = {input}
      style={{
        minWidth: '500px',
        minHeight: '500px'
      }}
      >
      </textarea>

    </div>
  );
}
