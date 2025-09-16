import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function CamerasPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cameras</CardTitle>
        <CardDescription>
          Live feeds and recordings from all your cameras.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-2">
              <div className="bg-muted aspect-video w-full rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Camera Feed {i}</p>
              </div>
              <div className="mt-2">
                <p className="font-semibold">Camera {i}</p>
                <p className="text-sm text-muted-foreground">
                  Location: Hallway {i}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
