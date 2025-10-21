import React from 'react'
import './styles/sidePanel.css'

const SidePanel = ({current}) => {

    const topics = [
        {name: 'dashboard', value: '/dashboard'},
        {name: 'view accounts', value: '/customers'},
        {name: 'update accounts', value: '/update'},
        {name: 'customer account list', value: '/customers'},
        {name: 'loyalty table', value: '/loyaltyTable'},
        {name: 'Report', value: '/ReportGenerate'},
        {name: 'log out', value: '/login'}
      ]

  return (
    <div className='sidePanel'>
        {
          topics.map((content, index) => (
            <a key={index} class={`${ current == content.name ? 'current' : null} sideBlock`} href={content.value}>
              <p>{content.name}</p>
            </a>
          ))
        }
    </div>
  )
}

export default SidePanel