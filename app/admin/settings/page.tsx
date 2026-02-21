'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                    Settings
                </h1>
                <p className="text-muted-foreground text-sm mt-1 font-medium">
                    Configure your portal experience.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/60 bg-card shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Portal Name</Label>
                            <Input placeholder="KUSME Company Portal" className="bg-background border-border/60 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label>Admin Email</Label>
                            <Input placeholder="admin@kusme.com" className="bg-background border-border/60 rounded-xl" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-xs text-muted-foreground">Receive daily digest of content updates.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Audit Logs</Label>
                                <p className="text-xs text-muted-foreground">Keep track of all project manager actions.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-lg">
                    Save Settings
                </Button>
            </div>
        </div>
    )
}
