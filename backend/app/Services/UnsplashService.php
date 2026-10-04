<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin wrapper around the Unsplash API. The access key never leaves the
 * server — the frontend only ever sees the resolved photo URL and
 * attribution that this service hands back (see SyncPlacementImages,
 * which is what actually calls this and caches the result in the
 * database, so a page render never has to call Unsplash directly).
 */
class UnsplashService
{
    private const BASE_URL = 'https://api.unsplash.com';

    private const UTM = 'utm_source=shopsphere&utm_medium=referral';

    private ?string $accessKey;

    public function __construct(?string $accessKey = null)
    {
        $this->accessKey = $accessKey ?? config('services.unsplash.access_key');
    }

    public function isConfigured(): bool
    {
        return filled($this->accessKey);
    }

    /**
     * Find the best-matching landscape photo for a query.
     *
     * @return array{url: string, photo_credit_name: string, photo_credit_url: string, download_location: string}|null
     */
    public function search(string $query): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $response = Http::withHeaders(['Authorization' => "Client-ID {$this->accessKey}"])
            ->get(self::BASE_URL.'/search/photos', [
                'query' => $query,
                'per_page' => 1,
                'orientation' => 'landscape',
                'content_filter' => 'high',
            ]);

        if (! $response->successful()) {
            Log::warning('Unsplash search failed.', ['query' => $query, 'status' => $response->status()]);

            return null;
        }

        $photo = $response->json('results.0');

        if (! $photo) {
            Log::warning('Unsplash search returned no results.', ['query' => $query]);

            return null;
        }

        return [
            'url' => $photo['urls']['regular'],
            'photo_credit_name' => $photo['user']['name'],
            'photo_credit_url' => $photo['user']['links']['html'].'?'.self::UTM,
            'download_location' => $photo['links']['download_location'],
        ];
    }

    /**
     * Unsplash's API guidelines require pinging this whenever a photo is
     * put to use (not just displayed after caching), so photographers get
     * credit in their stats. Fire-and-forget: never worth failing a sync
     * over.
     */
    public function trackDownload(string $downloadLocation): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        try {
            Http::withHeaders(['Authorization' => "Client-ID {$this->accessKey}"])->get($downloadLocation);
        } catch (\Throwable $exception) {
            Log::warning('Unsplash download tracking failed.', ['message' => $exception->getMessage()]);
        }
    }

    public function unsplashHomeUrl(): string
    {
        return 'https://unsplash.com/?'.self::UTM;
    }
}
