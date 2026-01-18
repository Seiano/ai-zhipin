'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Briefcase, User, Home, Sparkles, ArrowLeft } from 'lucide-react'

interface NavigationProps {
  variant?: 'seeker' | 'default'
}

export default function Navigation({ variant = 'default' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const basePath = variant === 'seeker' ? '/seeker' : ''

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-purple-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-purple-600 transition p-2 hover:bg-purple-50 rounded-lg" title="返回角色选择">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link href={basePath || '/'} className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">AI智聘</span>
                <span className="ml-2 text-sm text-purple-500 font-medium">求职者</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href={`${basePath}`} 
              className="flex items-center space-x-2 px-5 py-2.5 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all font-medium"
            >
              <Home className="h-4 w-4" />
              <span>首页</span>
            </Link>
            <Link 
              href={`${basePath}/jobs`} 
              className="flex items-center space-x-2 px-5 py-2.5 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all font-medium"
            >
              <Briefcase className="h-4 w-4" />
              <span>职位列表</span>
            </Link>
            <Link 
              href={`${basePath}/profile`} 
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
            >
              <User className="h-4 w-4" />
              <span>我的简历</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-purple-50 transition"
          >
            {isOpen ? <X className="h-6 w-6 text-purple-600" /> : <Menu className="h-6 w-6 text-purple-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href={basePath || '/'} className="block py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium">
              首页
            </Link>
            <Link href={`${basePath}/jobs`} className="block py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium">
              职位列表
            </Link>
            <Link href={`${basePath}/profile`} className="block py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium">
              我的简历
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
