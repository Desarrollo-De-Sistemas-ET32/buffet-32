import React, { useState } from 'react'
import AnalyticsUser from './analytics/AnalyticsUser'
import AnalyticsProduct from './analytics/AnalyticsProduct'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package } from 'lucide-react'

const AnalyticDashboard = () => {
    const [activeTab, setActiveTab] = useState('users')

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span>Panel de Analíticas</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="users" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Analíticas de Usuarios
                            </TabsTrigger>
                            <TabsTrigger value="products" className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Analíticas de Productos
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="users" className="mt-6">
                            <AnalyticsUser />
                        </TabsContent>
                        
                        <TabsContent value="products" className="mt-6">
                            <AnalyticsProduct />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default AnalyticDashboard