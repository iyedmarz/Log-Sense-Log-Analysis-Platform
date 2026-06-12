import { createFileRoute } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
  head: () => ({ meta: [{ title: 'Settings — LogSense' }] }),
});

function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, workspace, and preferences
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold">Profile</h2>
        <p className="text-xs text-muted-foreground">
          Your account information
        </p>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input defaultValue={user?.name} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user?.email} type="email" />
          </div>
        </div>
        <div className="mt-4">
          <Button>Save changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold">Appearance</h2>
        <p className="text-xs text-muted-foreground">
          Customize how LogSense looks
        </p>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Dark mode</Label>
            <p className="text-xs text-muted-foreground">
              Use the dark theme across the app
            </p>
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={toggle} />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <p className="text-xs text-muted-foreground">
          Choose when to be notified
        </p>
        <Separator className="my-4" />
        <div className="space-y-4">
          {[
            ['Email alerts', 'Critical errors and incidents'],
            ['Daily digest', 'Summary of activity each morning'],
            ['Weekly report', 'Top errors and trends every Monday'],
          ].map(([title, desc]) => (
            <div key={title} className="flex items-center justify-between">
              <div>
                <Label className="text-sm">{title}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold">API keys</h2>
        <p className="text-xs text-muted-foreground">
          Use this key to ship logs to LogSense
        </p>
        <Separator className="my-4" />
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value="ls_live_••••••••••••••••••••3f7a"
            className="font-mono text-xs"
          />
          <Button variant="outline">Copy</Button>
          <Button variant="outline">Rotate</Button>
        </div>
      </Card>
    </div>
  );
}
