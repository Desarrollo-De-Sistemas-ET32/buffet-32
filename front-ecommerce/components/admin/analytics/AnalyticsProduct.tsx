import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { fetchProductsAnalyticsAction } from '@/actions/products'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
    _id: string
    name: string
    description: string
    price: number
    category: {
        _id: string
        name: string
        slug: string
    }
    isActive: boolean
    stock: number
    discount: number
    images: string[]
    isFeatured: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

interface ChartDataPoint {
    date: string
    products: number
}

interface CategoryData {
    name: string
    value: number
    color: string
}

type DateRange = '7' | '30' | '60' | '90' | '120' | 'custom'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B']

const AnalyticsProduct = () => {
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
        queryKey: ['products-analytics', getDateRange.startDate, getDateRange.endDate],
        queryFn: () => fetchProductsAnalyticsAction(getDateRange.startDate, getDateRange.endDate),
        enabled: !(dateRange === 'custom' && (!customStartDate || !customEndDate))
    })

    // Process data to group products by creation date
    const chartData = useMemo((): ChartDataPoint[] => {
        if (!data?.data || !Array.isArray(data.data)) return []

        const productCounts: { [key: string]: number } = {}

        // Group products by creation date (day only)
        data.data.forEach((product: Product) => {
            const createdAt = new Date(product.createdAt)
            const dateKey = createdAt.toISOString().split('T')[0] // YYYY-MM-DD format
            
            productCounts[dateKey] = (productCounts[dateKey] || 0) + 1
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
            products: productCounts[date] || 0
        }))

        return sortedData
    }, [data, getDateRange.startDate, getDateRange.endDate])

    // Process category data for pie chart
    const categoryData = useMemo((): CategoryData[] => {
        if (!data?.data || !Array.isArray(data.data)) return []

        const categoryCounts: { [key: string]: number } = {}

        data.data.forEach((product: Product) => {
            const categoryName = product.category?.name || 'Sin categoría'
            categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1
        })

        return Object.entries(categoryCounts)
            .map(([name, value], index) => ({
                name,
                value,
                color: COLORS[index % COLORS.length]
            }))
            .sort((a, b) => b.value - a.value)
    }, [data])

    // ... (summaryStats calculation remains the same)

    useEffect(() => {
        // console.log(data?.data, 'product data')
        // console.log(chartData, 'product chartData')
        // console.log(categoryData, 'category data')
    }, [data, chartData, categoryData])

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
                                    <SelectItem value="custom">Rango personalizado</SelectItem>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{summaryStats.totalProducts}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{summaryStats.activeProducts}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos Destacados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{summaryStats.featuredProducts}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stock Bajo (≤10)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold text-orange-600">{summaryStats.lowStockProducts}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">${summaryStats.averagePrice.toFixed(2)}</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor Total del Inventario</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">${summaryStats.totalValue.toFixed(2)}</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Creation Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tendencias de Creación de Productos</CardTitle>
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
                                            formatter={(value: number) => [`${value} productos`, 'Nuevos Productos']}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="products" 
                                            stroke="#00C49F" 
                                            strokeWidth={2}
                                            dot={{ fill: '#00C49F', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Category Distribution Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Productos por Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] w-full">
                            {isLoading ? (
                                <div className="h-full w-full flex items-center justify-center">
                                    <div className="space-y-4 w-full">
                                        <Skeleton className="h-[350px] w-full rounded-full" />
                                    </div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => [`${value} productos`, 'Cantidad']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bar Chart */}
            {/* <Card>
                <CardHeader>
                    <CardTitle>Product Creation (Bar Chart)</CardTitle>
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
                                            return date.toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        labelFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString('en-US', { 
                                                year: 'numeric',
                                                month: 'long', 
                                                day: 'numeric' 
                                            })
                                        }}
                                        formatter={(value: number) => [`${value} products`, 'New Products']}
                                    />
                                    <Bar dataKey="products" fill="#00C49F" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}

export default AnalyticsProduct