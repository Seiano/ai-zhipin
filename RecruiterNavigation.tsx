'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Briefcase, Users, Home, MessageSquare, ArrowLeft, Building2, Plus } from 'lucide-react'

export default function RecruiterNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  
  const basePath = '/recruiter'

  return (
    <nav className="bg-slate-900/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-blue-400 transition p-2 hover:bg-slate-800 rounded-lg" title="返回角色选择">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link href={basePath} className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">AI智聘</span>
                <span className="ml-2 text-sm text-blue-400 font-medium">招聘者</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href={basePath} 
              className="flex items-center space-x-2 px-5 py-2.5 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all font-medium"
            >
              <Home className="h-4 w-4" />
              <span>工作台</span>
            </Link>
            <Link 
              href={`${basePath}/jobs`} 
              className="flex items-center space-x-2 px-5 py-2.5 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all font-medium"
            >
              <Briefcase className="h-4 w-4" />
              <span>职位管理</span>
            </Link>
            <Link 
              href={`${basePath}/candidates`} 
              className="flex items-center space-x-2 px-5 py-2.5 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all font-medium"
            >
              <Users className="h-4 w-4" />
              <span>候选人</span>
            </Link>
            <Link 
              href={`${basePath}/conversations`} 
              className="flex items-center space-x-2 px-5 py-2.5 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all font-medium"
            >
              <MessageSquare className="h-4 w-4" />
              <span>对话记录</span>
            </Link>
            <Link 
              href={`${basePath}/jobs/new`} 
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>发布职位</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition"
          >
            {isOpen ? <X className="h-6 w-6 text-blue-400" /> : <Menu className="h-6 w-6 text-blue-400" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href={basePath} className="block py-3 px-4 text-slate-300 hover:bg-slate-800 hover:text-blue-400 rounded-lg transition font-medium">
              工作台
            </Link>
            <Link href={`${basePath}/jobs`} className="block py-3 px-4 text-slate-300 hover:bg-slate-800 hover:text-blue-400 rounded-lg transition font-medium">
              职位管理
            </Link>
            <Link href={`${basePath}/candidates`} className="block py-3 px-4 text-slate-300 hover:bg-slate-800 hover:text-blue-400 rounded-lg transition font-medium">
              候选人
            </Link>
            <Link href={`${basePath}/conversations`} className="block py-3 px-4 text-slate-300 hover:bg-slate-800 hover:text-blue-400 rounded-lg transition font-medium">
              对话记录
            </Link>
            <Link href={`${basePath}/jobs/new`} className="block py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium">
              发布职位
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
