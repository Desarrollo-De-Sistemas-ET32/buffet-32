import ContactTemplate from '@/components/contact/ContactTemplate'
import PageContainer from '@/components/PageContainer'
import React from 'react'

const ContactPage = () => {
  return (
    <PageContainer showHeader={true} showFooter={true}>
      <ContactTemplate />
    </PageContainer>
  )
}

export default ContactPage