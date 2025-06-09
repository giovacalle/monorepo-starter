class CustomError extends Error {
	status: number;
	data: any;
	headers: Headers;

	constructor(message: string, status: number, data: any, headers: Headers) {
		super(message);
		this.status = status;
		this.data = data;
		this.headers = headers;
	}
}

type CustomFetch = {
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	data?: Record<string, any>;
	params?: any;
	signal?: AbortSignal;
};

export const baseCustomFetch = async <T>({
	url,
	method,
	headers = {},
	data,
	params,
	signal
}: CustomFetch): Promise<{
	status: number;
	data: T;
	headers: Headers;
}> => {
	const requestHeaders = getHeaders(headers);
	const requestParams = getParams(params);
	const requestUrl = `${url}${requestParams ? `?${requestParams}` : ''}`;

	const isFormData = data instanceof FormData;

	try {
		const response = await fetch(requestUrl, {
			method,
			headers: requestHeaders as Record<string, string>,
			body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
			signal
		});

		const dataResponse = await getBody<T>(response);

		if (!response.ok)
			throw new CustomError(
				`Request failed with status ${response.status}`,
				response.status,
				dataResponse,
				response.headers
			);

		return { status: response.status, data: dataResponse, headers: response.headers };
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError')
			throw { status: 499, message: 'Request aborted', data: null };

		if (error instanceof CustomError) throw error;

		throw { status: 0, message: 'Network error', data: null };
	}
};

function getHeaders(headers: object): object {
	const mapHeaders = new Map(Object.entries(headers));
	mapHeaders.delete('Content-Type');
	return Object.fromEntries(mapHeaders);
}

function getParams(params: any): string | undefined {
	if (params) {
		const searchParams = new URLSearchParams(params);
		for (const [key, value] of searchParams.entries()) {
			if (value === null || value === undefined) searchParams.delete(key);
		}
		return searchParams.toString();
	}
	return;
}

function getBody<T>(c: Response | Request): Promise<T> {
	const contentType = c.headers.get('Content-Type');

	if (contentType) {
		if (contentType.includes('application/json')) return c.json() as Promise<T>;
		if (contentType.includes('application/pdf')) return c.blob() as Promise<T>;
	}

	return c.text() as Promise<T>;
}
