import React from 'react';
import { Link } from 'react-router-dom';
import { FcIdea } from "react-icons/fc";

export default function NotFound() {
  return (
    <div className="not-found">
      <FcIdea className="teapot-icon" />
      <h1>418</h1>
      <h2>Я чайник</h2>
      <p>Извините, но я не могу заварить кофе, потому что я чайник.</p>
      <div className="btn-group">
        <Link to="/" className="btn">На главную</Link>
       
      </div>
    </div>
  );
}