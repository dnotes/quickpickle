import React, { useState } from 'react'

export interface HelloProps {
  name?: string
}

export function Hello({ name = 'world' }: HelloProps) {
  const [currentName, setCurrentName] = useState(name)

  return (
    <div>
      <h1>Hello {currentName}!</h1>
      <label>
        <span>Name</span>
        <input
          type="text"
          value={currentName}
          onChange={e => setCurrentName(e.target.value)}
        />
      </label>
    </div>
  )
}