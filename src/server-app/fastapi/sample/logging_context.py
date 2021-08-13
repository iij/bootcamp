import datetime
import json
import time
import traceback
from logging import DEBUG, basicConfig, getLogger
from typing import Callable, Optional

from fastapi import Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.routing import APIRoute
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = getLogger(__name__)
basicConfig(
    level=DEBUG,
    format="[%(asctime)s] [%(process)d] [%(levelname)s] [%(name)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S %z",
)


class LoggingContextRoute(APIRoute):
    """FastAPIのAPIRouteをHookし、request/responseの中身をログ出力するクラス

    Args:
        APIRoute: FastAPI APIRouteクラスを継承
    """

    def get_route_handler(self, log_level: Optional[str] = None) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Optional[Response]:
            response = None
            record = {}
            await self._logging_request(request, record)

            # 処理にかかる時間を計測
            before = time.time()
            try:
                response = await self._execute_request(
                    request, original_route_handler, record
                )
            finally:
                duration = round(time.time() - before, 4)
                time_local = datetime.datetime.fromtimestamp(before)
                record["request_time"] = time_local.strftime("%Y/%m/%d %H:%M:%S%Z")
                record["processing _time"] = str(duration)
                await self._logging_response(response, record)
                if log_level == "debug":
                    logger.debug(json.dumps(record))
                elif log_level == "slim":
                    record.pop("response_body")
                    logger.info(json.dumps(record))
                else:
                    logger.info(json.dumps(record))

            return response

        return custom_route_handler

    async def _execute_request(
        self, request: Request, route_handler: Callable, record: dict
    ) -> Response:
        try:
            response: Response = await route_handler(request)
        except StarletteHTTPException as exc:
            record["error"] = exc.detail
            record["status"] = exc.status_code
            record["traceback"] = traceback.format_exc().splitlines()
            raise
        except RequestValidationError as exc:
            record["error"] = exc.errors()
            record["traceback"] = traceback.format_exc().splitlines()
            raise
        return response

    async def _logging_response(
        self, response: Optional[Response], record: dict
    ) -> Optional[Response]:
        if response is None:
            return
        try:
            record["response_body"] = json.loads(response.body.decode("utf-8"))
        except json.JSONDecodeError:
            record["response_body"] = response.body.decode("utf-8")
        record["status_code"] = response.status_code
        # record["response_headers"] = {
        #     k.decode("utf-8"): v.decode("utf-8") for (k, v) in response.headers.raw
        # }

    async def _logging_request(
        self, request: Request, record: dict
    ) -> Optional[Response]:
        if await request.body():
            try:
                record["request_body"] = await request.json()
            except json.JSONDecodeError:
                record["request_body"] = (await request.body()).decode("utf-8")
        # record["request_headers"] = {
        #     k.decode("utf-8"): v.decode("utf-8") for (k, v) in request.headers.raw
        # }
        record["remote_addr"] = request.client.host
        record["request_method"] = request.method
        record["request_uri"] = request.url.path


class DebugLoggingContextRoute(LoggingContextRoute):
    def get_route_handler(self) -> Callable:
        return super().get_route_handler(log_level="debug")


class SlimLoggingContextRoute(LoggingContextRoute):
    def get_route_handler(self) -> Callable:
        return super().get_route_handler(log_level="slim")
