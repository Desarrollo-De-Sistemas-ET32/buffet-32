import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { getUsersAction } from '@/actions/user'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
    _id: string
    username: string
    email: string
    password: string
    role: 'admin' | 'user'
    firstName?: string
    lastName?: string
    phone?: string
    dni?: string
    course?: string
    division?: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface ChartDataPoint {
    date: string
    users: number
}

type DateRange = '7' | '30' | '60' | '90' | '120' | 'custom'

const AnalyticsUser = () => {
    const [dateRange, setDateRange] = useState<DateRange>('7')
    const [customStartDate, setCustomStartDate] = useState<string>('')
    const [customEndDate, setCustomEndDate] = useState<string>('')

    // Calculate date range based on selection
    const getDateRange = useMemo(() => {
        const endDate = endOfDay(new Date())
        
        switch (dateRange) {
            case '7':
                return {
                    startDate: startOfDay(subDays(new Date(), 7)).toISOString(),
                    endDate: endDate.toISOString()
                }
            case '30':
                return {
                    startDate: startOfDay(subDays(new Date(), 30)).toISOString(),
                    endDate: endDate.toISOString()
                }
            case '60':
                return {
                    startDate: startOfDay(subDays(new Date(), 60)).toISOString(),
                    endDate: endDate.toISOString()
                }
            case '90':
                return {
                    startDate: startOfDay(subDays(new Date(), 90)).toISOString(),
                    endDate: endDate.toISOString()
                }
            case '120':
                return {
                    startDate: startOfDay(subDays(new Date(), 120)).toISOString(),
                    endDate: endDate.toISOString()
                }
            case 'custom':
                return {
                    startDate: customStartDate,
                    endDate: customEndDate
                }
            default:
                return {
                    startDate: startOfDay(subDays(new Date(), 30)).toISOString(),
                    endDate: endDate.toISOString()
                }
        }
    }, [dateRange, customStartDate, customEndDate])

    const { data, isLoading, error } = useQuery({
        queryKey: ['users', getDateRange.startDate, getDateRange.endDate],
        queryFn: () => getUsersAction(getDateRange.startDate, getDateRange.endDate),
        enabled: !(dateRange === 'custom' && (!customStartDate || !customEndDate))
    })

    // Process data to group users by creation date
    const chartData = useMemo((): ChartDataPoint[] => {
        if (!data?.data || !Array.isArray(data.data)) return []

        const userCounts: { [key: string]: number } = {}

        // Group users by creation date (day only)
        data.data.forEach((user: User) => {
            const createdAt = new Date(user.createdAt)
            const dateKey = createdAt.toISOString().split('T')[0] // YYYY-MM-DD format
            
            userCounts[dateKey] = (userCounts[dateKey] || 0) + 1
        })

        // Create array of all dates in the range
        const allDates: string[] = []
        const startDate = new Date(getDateRange.startDate)
        const endDate = new Date(getDateRange.endDate)
        
        // Generate all dates in the range
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            allDates.push(d.toISOString().split('T')[0])
        }

        // Create chart data with all dates, filling in zeros for missing dates
        const sortedData = allDates.map(date => ({
            date,
            users: userCounts[date] || 0
        }))

        return sortedData
    }, [data, getDateRange.startDate, getDateRange.endDate])

    useEffect(() => {
        // console.log(data?.data, 'data')
        // console.log(chartData, 'chartData')
    }, [data, chartData])

    const handleDateRangeChange = (value: string) => {
        setDateRange(value as DateRange)
        if (value !== 'custom') {
            setCustomStartDate('')
            setCustomEndDate('')
        }
    }

    if (error) return <div>Error: {error.message}</div>

    return (
        <div className="space-y-6">
            {/* Date Range Filter */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtro de Rango de Fechas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Seleccionar Rango de Fechas</label>
                            <Select value={dateRange} onValueChange={handleDateRangeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar rango de fechas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">Últimos 7 días</SelectItem>
                                    <SelectItem value="30">Últimos 30 días</SelectItem>
                                    <SelectItem value="60">Últimos 60 días</SelectItem>
                                    <SelectItem value="90">Últimos 90 días</SelectItem>
                                    <SelectItem value="120">Últimos 120 días</SelectItem>
                                    {/* <SelectItem value="custom">Custom range</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>

                        {dateRange === 'custom' && (
                            <>
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-2 block">Fecha de Inicio</label>
                                    <input
                                        type="date"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-2 block">Fecha de Fin</label>
                                    <input
                                        type="date"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </>
                        )}

                        <div className="text-sm text-muted-foreground">
                            {dateRange !== 'custom' && (
                                <span>
                                    {format(new Date(getDateRange.startDate), 'MMM dd, yyyy')} - {format(new Date(getDateRange.endDate), 'MMM dd, yyyy')}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts */}
            <Card>
                <CardHeader>
                    <CardTitle>Analíticas de Registro de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        {isLoading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="space-y-4 w-full">
                                    <Skeleton className="h-[350px] w-full" />
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString('es-ES', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        labelFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString('es-ES', { 
                                                year: 'numeric',
                                                month: 'long', 
                                                day: 'numeric' 
                                            })
                                        }}
                                        formatter={(value: number) => [`${value} usuarios`, 'Nuevos Usuarios']}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="users" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Bar Chart Alternative */}
            <Card>
                <CardHeader>
                    <CardTitle>Registro de Usuarios (Gráfico de Barras)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        {isLoading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="space-y-4 w-full">
                                    <Skeleton className="h-[350px] w-full" />
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString('es-ES', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        labelFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString('es-ES', { 
                                                year: 'numeric',
                                                month: 'long', 
                                                day: 'numeric' 
                                            })
                                        }}
                                        formatter={(value: number) => [`${value} usuarios`, 'Nuevos Usuarios']}
                                    />
                                    <Bar dataKey="users" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{data?.data?.length || 0}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Días con Registros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{chartData.length}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Promedio de Usuarios/Día</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {chartData.length > 0 
                                    ? (data?.data?.length / chartData.length).toFixed(1)
                                    : 0
                                }
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AnalyticsUser
