"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Heart, Package, Settings, User } from 'lucide-react';
import ProfileOrders from './ProfileOrders';
import ProfileUser from './ProfileUser';
import ProfileWishlist from './ProfileWishlist';
import ProfileSettings from './ProfileSettings';

const ProfileComponent = () => {
  return (
    <div className='w-full flex flex-col gap-4'>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-1">
            <Package className="h-4 w-4" />
            <span>Pedidos</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>Favoritos</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-1">
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileUser />
        </TabsContent>
        
        <TabsContent value="orders">
          <ProfileOrders />
        </TabsContent>
        
        <TabsContent value="wishlist">
          <ProfileWishlist />
        </TabsContent>
        
        <TabsContent value="settings">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfileComponent
