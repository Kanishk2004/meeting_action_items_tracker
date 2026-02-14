import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import connect from '@/lib/db';
import Transcript from '@/models/transcript';

/**
 * GET /api/health
 * Returns health status of backend, database, and LLM connection,
 * plus total transcripts processed.
 */
export async function GET() {
	const health = {
		status: 'ok',
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
		services: {
			database: { status: 'unknown', latency: null },
			llm: { status: 'unknown', latency: null, model: null },
		},
		stats: {
			totalTranscripts: 0,
		},
	};

	// Check Database
	try {
		const dbStart = Date.now();
		await connect();
		// Ping to verify the connection is alive
		await mongoose.connection.db.admin().ping();
		health.services.database.status = 'connected';
		health.services.database.latency = Date.now() - dbStart;
	} catch (error) {
		health.services.database.status = 'disconnected';
		health.services.database.error = error.message;
		health.status = 'degraded';
	}

	// Check LLM (OpenAI)
	try {
		const llmStart = Date.now();
		const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		const res = await openai.chat.completions.create({
			model: 'gpt-4.1-mini',
			messages: [{ role: 'user', content: 'ping' }],
			max_tokens: 1,
		});
		health.services.llm.status = 'connected';
		health.services.llm.latency = Date.now() - llmStart;
		health.services.llm.model = 'gpt-4.1-mini';
	} catch (error) {
		health.services.llm.status = 'disconnected';
		health.services.llm.error = error.message;
		health.status = 'degraded';
	}

	// Get total transcripts count
	try {
		health.stats.totalTranscripts = await Transcript.countDocuments();
	} catch {
		// If DB is down, count stays 0
	}

	const httpStatus = health.status === 'ok' ? 200 : 503;
	return NextResponse.json(health, { status: httpStatus });
}
