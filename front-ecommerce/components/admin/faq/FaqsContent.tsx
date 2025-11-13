import { getFaqs } from '@/actions/faq'
import { FAQItem } from '@/data/faq'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'


type FaqCategory = {
    _id: string
    name: string
    description: string
    faqs: FAQItem[]
}

const FaqsContent = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['faqs'],
        queryFn: () => getFaqs(),
    })

    useEffect(() => {
        console.log(data)
    }, [data])

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <div>
            <h1>FaqsContent</h1>
            {
                data?.data?.map((faqCategory: FaqCategory) => (
                    <div key={faqCategory._id}>
                        <h2>{faqCategory.name}</h2>
                        <p>{faqCategory.description}</p>
                        {
                            faqCategory.faqs.map((faq: FAQItem) => (
                                <div key={faq.order}>
                                    <h3>{faq.question}</h3>
                                    <p>{faq.answer}</p>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
  )
}

export default FaqsContent